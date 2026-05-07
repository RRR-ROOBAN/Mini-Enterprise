VALID_TRANSITIONS = {
    "todo": ["in_progress"],
    "in_progress": ["review"],
    "review": ["done"],
    "done": []
}