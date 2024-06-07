class UserNotFoundException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class UserNotFoundError(UserNotFoundException):
    def __init__(self, phone: str) -> None:
        super().__init__(f"User not found with the phone number: {phone}")


class TaskNotFoundException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class TaskNotFoundError(UserNotFoundException):
    def __init__(self, task_id: str):
        self.task_id = task_id
        super().__init__(f"Task not found with the id [{task_id}]")
