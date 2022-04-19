import time

class SchoolClass:
    def __init__(self, row, prop_table, semester):
        self.prop_table = prop_table
        self.semester = semester;
        for key in prop_table:
            self.__setattr__(key, row[prop_table[key]])
        self.created = int(time.time() * 1000)
        self.semester = semester
        pass

    def __str__(self) -> str:
        result = ""
        for key in self.prop_table:
            result = result + key + ": " + \
                str(self.__getattribute__(key)) + "|"
        result += "semester: " + str(self.semester) + "|"
        result += "created: " + str(self.created)
        return result

    def to_dict(self):
        result = {}
        for key in self.prop_table:
            result[key] = self.__getattribute__(key)
        result["created"] = self.created
        result["semester"] = self.semester
        return result