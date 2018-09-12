cmake_minimum_required(VERSION 3.5)
project(Sudoku)

include_directories("/usr/local/include")

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
set(SOURCE_COMMON_FILES src/libs/sudoku.cpp)
set(SOURCE_SUDOKU_FILES src/main.cpp)

add_executable(sudoku ${SOURCE_COMMON_FILES} ${SOURCE_SUDOKU_FILES})
