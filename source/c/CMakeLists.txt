cmake_minimum_required(VERSION 3.5)
project(Sudoku)

include_directories("/usr/local/include")

set(SOURCE_COMMON_FILES src/libs/sudoku.c)
set(SOURCE_SUDOKU_FILES src/main.c)

add_executable(sudoku ${SOURCE_COMMON_FILES} ${SOURCE_SUDOKU_FILES})
