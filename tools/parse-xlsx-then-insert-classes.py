import os
import time
import dotenv
import pymongo
import openpyxl

dotenv.load_dotenv(dotenv.find_dotenv(filename=".xlsx.local.env", raise_error_if_not_found=True))

COLUMN_NAME_TO_PROP_MAPPER = {
    "Mã_lớp": "MaLop",
    "Mã_lớp_kèm": "MaLopKem",
    "Mã_HP": "MaHocPhan",
    "Tên_HP": "TenHocPhan",
    "Buổi_số": "BuoiHocSo",
    "Thứ": "HocVaoThu",
    "Phòng": "PhongHoc",
    "Thời_gian": "ThoiGianHoc",
    "Tuần": "HocVaoCacTuan",
    "Loại_lớp": "LoaiLop",
    "Ghi_chú": "GhiChu",
}

PROP_TABLE = {
    "MaLop": -1,
    "MaLopKem": -1,
    "MaHocPhan": -1,
    "TenHocPhan": -1,
    "BuoiHocSo": -1,
    "HocVaoThu": -1,
    "PhongHoc": -1,
    "ThoiGianHoc": -1,
    "HocVaoCacTuan": -1,
    "LoaiLop": -1,
    "GhiChu": -1,
}

class SchoolClass:
    def __init__(self, row):
        for key in PROP_TABLE:
            self.__setattr__(key, row[PROP_TABLE[key]])
        self.created = int(time.time() * 1000)
        self.semester = SEMESTER
        pass

    def __str__(self) -> str:
        result = ""
        for key in PROP_TABLE:
            result = result + key + ": " + \
                str(self.__getattribute__(key)) + "|"
        result += "semester: " + str(self.semester) + "|"
        result += "created: " + str(self.created)
        return result

    def to_dict(self):
        result = {}
        for key in PROP_TABLE:
            result[key] = self.__getattribute__(key)
        result["created"] = self.created
        result["semester"] = self.semester
        return result

SEMESTER = os.getenv("SEMESTER")
print(f"semester={SEMESTER}")

DATABASE_NAME = os.getenv("DATABASE_NAME")
print(f"database_name={DATABASE_NAME}")

XLSX_FILEPATH = os.getenv("XLSX_PATH")
print(f"xlsx_path=${XLSX_FILEPATH}")

CONNECTION_STRING = os.getenv("CONNECTION_STRING")
print(f"connection_string={CONNECTION_STRING}")

client = pymongo.MongoClient(CONNECTION_STRING, serverSelectionTimeoutMS=5000)

wb = openpyxl.load_workbook(XLSX_FILEPATH)
ws = wb.active
max_column = ws.max_column
max_row = ws.max_row

print(f"max_column={max_column}")
print(f"max_row={max_row}")

found_prop_table = False
prompt_to_process = False
current_row = 0

def check_found_prop_table():
    for key in PROP_TABLE:
        if PROP_TABLE[key] != -1:
            return True
    return False

school_classes_to_insert = []
classes_count = 0

for row in ws.iter_rows(min_row=0, values_only=True):
    current_row += 1
    if not found_prop_table:
        # determine column name then map it to prop table
        i = 0
        for cell in row:
            prop_name = COLUMN_NAME_TO_PROP_MAPPER.get(cell)
            if(prop_name):
                PROP_TABLE[prop_name] = i
            i = i + 1
        if check_found_prop_table():
            found_prop_table = True
            print("\n*** prop_table ***")
            for key in PROP_TABLE:
                print(key, "=", PROP_TABLE[key], end="|")
            value = input("\nis that ok ? (Y) to continue (Other) to cancel: ")
            if value == "Y":
                prompt_to_process = True
                print(f'start_data_row = {current_row}')
    elif (prompt_to_process):
        classes_count = classes_count + 1
        school_class = SchoolClass(row)
        school_classes_to_insert.append(school_class.to_dict())

if len(school_classes_to_insert) > 0:
    result = client[DATABASE_NAME]["school.classes"].insert_many(school_classes_to_insert)
    print('count =', classes_count)
    print('inserted = ', len(result.inserted_ids))
