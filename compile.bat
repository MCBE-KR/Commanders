@echo off
chcp 65001

del /S /Q *.js
cd Commanders(B)
call tsc

cd ../
set beh="C:\Users\%username%\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\Commanders(B)"
set res="C:\Users\%username%\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_resource_packs\Commanders(R)"

echo Y | rmdir /s %beh%
mkdir %beh%
xcopy "%cd%\Commanders(B)" %beh% /E /y

echo Y | rmdir /s %res%
mkdir %res%
xcopy "%cd%\Commanders(R)" %res% /E /y

call dpdm --no-warning --no-tree --exit-code circular:1 ./Commanders(B)/scripts