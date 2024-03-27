from django.db import models

class ChatUser(models.Model):
    name = models.CharField(max_length=128, null=False)
    lang = models.CharField(
        max_length=2,
        default="en"
    )

    def __str__(self) -> str:
        return f"{self.name}: {self.lang}"


class Message(models.Model):
    author = models.ForeignKey(
        ChatUser, related_name="messages", on_delete=models.CASCADE
    )
    room = models.ForeignKey("Room", related_name="messages", on_delete=models.CASCADE)
    content = models.TextField()
    lang = models.CharField(
        max_length=2,
        default="en"
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.author.name}: {self.content}"


class Room(models.Model):
    name = models.CharField(max_length=128)
    users = models.ManyToManyField(ChatUser, related_name="rooms")

    def __str__(self) -> str:
        return f"{self.name}: {','.join([str(user) for user in self.users.all()])}"

    def getMessages(self, limit=10):
        return self.messages.objects.order_by("-timestamp").all()[:limit]