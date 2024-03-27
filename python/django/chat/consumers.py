import json
from datetime import datetime
from enum import Enum

from asgiref.sync import async_to_sync
from channels.auth import login
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import ChatUser, Message, Room


class MSG_TYPES(Enum):
    JOINED = "joined"
    MESSAGE = "message"
    LEAVE = "leave"


class ChatRoomConsumer(AsyncWebsocketConsumer):
    def get_user(self, user_id):
        return ChatUser.objects.filter(id=user_id)

    def get_room(self, room_name):
        return Room.objects.filter(name=room_name)

    @database_sync_to_async
    def get_room_users(self, room_name):
        return Room.objects.get(name=room_name).users.all().count()

    @database_sync_to_async
    def create_room(self, room_name):
        room = self.get_room(room_name)
        if len(room) > 0:
            return
        new_room = Room(name=room_name)
        new_room.save()

    @database_sync_to_async
    def delete_room(self, room_name):
        room = self.get_room(room_name)[0]
        room.delete()
        room.save()

    @database_sync_to_async
    def add_user_to_room(self, user_id, room_name, username=None, lang=None):
        user = None
        if user_id is None:
            user = ChatUser(name=username, lang=lang)
            user.save()
        else:
            user = self.get_user(user_id)[0]
        room = self.get_room(room_name)[0]
        room.users.add(user)
        room.save()
        return user.pk

    @database_sync_to_async
    def remove_user_from_room(self, user_id, room_name):
        user = self.get_user(user_id)[0]
        room = self.get_room(room_name)[0]
        room.users.remove(user)
        room.save()

    @database_sync_to_async
    def create_msg(self, user_id, room_name=None, message=None, lang=None):
        sender = self.get_user(user_id)[0]
        room = self.get_room(room_name)[0]
        msg = Message(author=sender, room=room, content=message, lang=lang)
        msg.save()
        return msg.timestamp

    # connect to a room/group and store channel name
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.group_name = f"chat_{self.room_name}"

        # add user to group
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        # accept connection request to complete handshake
        await self.accept()

        # create the room in database if not already exists
        await self.create_room(self.room_name)

    # disconnect from group/channel name
    async def disconnect(self, code):
        # if all users leave, then delete the room
        users = await self.get_room_users(self.room_name)
        if users == 0:
            await self.delete_room(self.room_name)

        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # receive a message from client and send to group
    async def receive(self, text_data):
        # format the data in json and parse it
        data = json.loads(text_data)
        msg_type = data["msg_type"]
        message = data.get("message")
        user_id = data.get("user_id")
        username = data.get("username")
        lang = data.get("lang")
        timestamp = datetime.now()

        # handle based on msg_type
        if msg_type == "joined":
            # on join, add user to room
            user_id = await self.add_user_to_room(
                user_id, self.room_name, username, lang
            )
        elif msg_type == "leave":
            # on leave, remove user from room
            await self.remove_user_from_room(user_id, self.room_name)
            await self.close()
            return
        elif msg_type == "message":
            # on message, add message
            timestamp = await self.create_msg(user_id, self.room_name, message, lang)

        # send message to group
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "chatroom_message",
                "msg_type": msg_type,
                "message": message,
                "user_id": user_id,
                "username": username,
                "lang": lang,
                "timestamp": timestamp,
            },
        )

    # send message with appropriate msg_type
    async def chatroom_message(self, event):
        msg_type = event["msg_type"]
        message = event["message"]
        user_id = event["user_id"]
        username = event["username"]
        lang = event["lang"]
        timestamp = event["timestamp"]

        await self.send(
            text_data=json.dumps(
                {
                    "msg_type": msg_type,
                    "message": message,
                    "user_id": user_id,
                    "username": username,
                    "lang": lang,
                    "timestamp": timestamp,
                },
                default=str,
            )
        )
