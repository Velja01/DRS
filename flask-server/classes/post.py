# Post.py

class Post:
    def __init__(self, id, title, content, author, created_at, upvotes, downvotes, comments):
        self.id = id
        self.title = title
        self.content = content
        self.author = author
        self.created_at = created_at
        self.upvotes = upvotes
        self.downvotes = downvotes
        self.comments = comments
