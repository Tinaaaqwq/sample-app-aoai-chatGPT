

class EmailUser():
    def __init__(self, user_id = "", login_status = False):
        self.user_id = user_id
        self.login_status = login_status

    def login(self, user_id, login_status):
        self.user_id = user_id
        self.login_status = login_status

    def logout(self):
        self.user_id = ""
        self.login_status = False



        

