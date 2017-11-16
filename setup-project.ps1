# innovaphone Project Setup Script v1.3
# (c) 2016 innovaphone AG
# All rights reserved
#

function UserConfirm ($message)
{
    Write-Host $message " [" -NoNewline
    Write-Host "Y" -ForegroundColor Yellow -NoNewline
    Write-Host "/" -NoNewline
    Write-Host "N" -ForegroundColor Yellow -NoNewline
    Write-Host "/[" -NoNewline
    Write-Host "ctrl+c" -ForegroundColor Yellow  -NoNewline
    Write-Host "] : " -NoNewline

    return (Read-Host).ToLower().StartsWith("y")
}

function ExitScript
{
    Write-Host
    Write-Host " Press [" -NoNewline
    Write-Host "enter" -ForegroundColor Yellow -NoNewline
    Write-Host "] to exit... " -NoNewline
    Read-Host
    exit
}


Clear-Host
$HOST.UI.RawUI.WindowTitle = "innovaphone Project Setup v$appVersion"
$appVersion = "1.3"
$org_class_name = "SDKSample"
$org_prj_name = "sdksample"

Write-Host "=======================================================================================" -ForegroundColor Magenta
Write-Host "  innovaphone Project Setup v$appVersion" -ForegroundColor Cyan -NoNewline
Write-Host " || " -NoNewline
Write-Host "(c) by innovaphone AG 2016" -ForegroundColor Cyan -NoNewline
Write-Host " || " -NoNewline
Write-Host "All rights reserved " -ForegroundColor Cyan
Write-Host "=======================================================================================" -ForegroundColor Magenta
Write-Host
#Write-Host "  copyright (c) by innovaphone AG 2016" -ForegroundColor Cyan
#Write-Host "  All rights reserved" -ForegroundColor Cyan

if (!$PSVersionTable -or ($PSVersionTable.PSVersion.Major -lt 3)) {
    Write-Host "ERROR: The innovaphone Project Setup Script needs Microsoft PowerShell v3 or newer" -ForegroundColor Red
    Write-Host "       You are using " -ForegroundColor Red -NoNewline
    if (!$PSVersionTable) {
        Write-Host "v1.x" -ForegroundColor Red
    }
    else {
        $cur_ver = "v" + $PSVersionTable.PSVersion.Major + ".x";
        Write-Host $cur_ver -ForegroundColor Red
    }
    ExitScript
}

Write-Host " This file will prepare the $org_class_name project to be used as a new project, by renaming"
Write-Host " and patching the necessary files. The new project will be copied to a folder with the"
Write-Host " Name of the project to not changed or delete files of the $org_class_name itself."
Write-Host
Write-Host " Please insert the name of the projects main class. It is recommended to use a mixed case"
Write-Host " name (e. g. MyNewProject). For the name of the project as well for the projects folder,"
Write-Host " that name will be converted to lower case."

$dataCorrect = $False
while (!$dataCorrect) {
    Write-Host
    Write-Host " Name of main class ([" -NoNewline
    Write-Host "ctrl+c" -ForegroundColor Yellow -NoNewline
    Write-Host "] to cancel) : " -NoNewLine

    $class_name = Read-Host
    $prj_name = $class_name.ToLower();
    $prj_path = (Resolve-Path ..\).Path + "\" + $prj_name

    Write-Host
    Write-Host " Please confirm the values below"
    Write-Host " Project path : " -NoNewline
    Write-Host $prj_path -ForegroundColor Cyan
    Write-Host " Project name : " -NoNewLine
    Write-Host $prj_name -ForegroundColor Cyan
    Write-Host " Class name   : " -NoNewLine
    Write-Host $class_name -ForegroundColor Cyan
    Write-Host

    $dataCorrect = UserConfirm(" Is that correct?");
    Write-Host

    if ($dataCorrect -and (Test-Path $prj_path)) {
        Write-Host " WARNING: The path $prj_path already exists." -ForegroundColor Red
        $dataCorrect = UserConfirm(" Do you whant override the path and all of it's files?");
        if ($dataCorrect) {
            try {
                # We need to remove all readonly and hidden attribs, or we could not delete
                # the files...
                attrib -R -H $prj_path\*.* /S
                Remove-Item $prj_path -Recurse -ErrorAction Stop
            }
            catch {
                Write-Host
                Write-Host " ERROR  : Failed to remove path $prj_path :" -ForegroundColor Red
                Write-Host " Reason : $_" -ForegroundColor Red
                ExitScript
            }
        }
    }
}

Write-Host " Setting up project, please wait."
Write-Host

# This list containes all files that needs to be patched and / or renamed. The flag defines,
# If the filed needs to be patched (1) or only renamed (0)
$file_list = @(
    [pscustomobject]@{flag=1; file_name="$org_prj_name.mak"},
    [pscustomobject]@{flag=1; file_name="$org_prj_name.sln"},
    [pscustomobject]@{flag=1; file_name="$org_prj_name.vcxproj"},
    [pscustomobject]@{flag=1; file_name="$org_prj_name.vcxproj.filters"},
    [pscustomobject]@{flag=1; file_name="$org_prj_name-arm-visual-gdb.vgdbsettings"},
    [pscustomobject]@{flag=1; file_name="$org_prj_name-i386-visual-gdb.vgdbsettings"},
    [pscustomobject]@{flag=1; file_name="$org_prj_name-main.cpp"},
    [pscustomobject]@{flag=1; file_name="$prj_name\$org_prj_name.cpp"},
    [pscustomobject]@{flag=1; file_name="$prj_name\$org_prj_name.h"},
    [pscustomobject]@{flag=1; file_name="$prj_name\$org_prj_name.mak"},
    [pscustomobject]@{flag=1; file_name="$prj_name\apps\apps.mak"},
    [pscustomobject]@{flag=1; file_name="$prj_name\apps\innovaphone.$org_prj_name.js"},
    [pscustomobject]@{flag=1; file_name="$prj_name\apps\$org_prj_name.htm"},
    [pscustomobject]@{flag=0; file_name="$prj_name\apps\$org_prj_name.png"}
)

$steps = 0;
$steps_max = $file_list.length + 1;

try {
    Write-Progress -id 1 -Activity "Preparing new project" -Status "Copying files" -PercentComplete(100 / $steps_max * $steps)
    Write-Host " Copying files.................................................................." -NoNewline
    Copy-Item -Path . $prj_path -Exclude setup-project.* -Recurse -ErrorAction stop
    Rename-Item $prj_path\$org_prj_name $prj_path\$prj_name -ErrorAction stop
    attrib -R $prj_path\*.* /S
    Write-Host " done" -ForegroundColor Green
    $steps++

    foreach ($cur_item in $file_list) {
        $cur_src_file = $cur_item."file_name";
        $cur_file = $cur_src_file.Replace($org_prj_name, $prj_name);

        if ($cur_item."flag" -eq 0) {
            Write-Progress -id 1 -Activity "Preparing new project" -Status "Renaming $cur_file" -PercentComplete(100 / $steps_max * $steps)
            Write-Host " Renaming $cur_file......................................................................".Substring(0, 80) -NoNewline
            Rename-Item $prj_path\$cur_src_file $prj_path\$cur_file -ErrorAction stop
        }
        else {
            Write-Progress -id 1 -Activity "Preparing new project" -Status "Patching $cur_file" -PercentComplete(100 / $steps_max * $steps)
            Write-Host " Patching $cur_file......................................................................".Substring(0, 80) -NoNewline
            # Rename-Item $prj_path\$cur_src_file $prj_path\$cur_file -ErrorAction stop
            ##(Get-Content $prj_path\$cur_file -ErrorAction stop) -creplace 'sdksample', $prj_name | Out-File $prj_path\$cur_file -ErrorAction stop
            (Get-Content $prj_path\$cur_src_file -ErrorAction stop) | ForEach-Object {
                $_.replace($org_prj_name, $prj_name).replace($org_class_name, $class_name)
            } | Set-Content $prj_path\$cur_file
            if ($cur_src_file -ine $cur_file) {
                Remove-Item $prj_path\$cur_src_file -ErrorAction stop
            }
        }
        Write-Host " done" -ForegroundColor Green
        $steps++
    }

    Write-Progress -id 1 -Activity "Preparing new project" -Status "Done" -PercentComplete(100)
    Write-Host
    Write-Host
    Write-Host " Project created successfully."
    ExitScript
}
Catch {
    Write-Host " failed" -ForegroundColor Red
    Write-Host
    Write-Host " ERROR  : Last operation failed" -ForegroundColor Red
    Write-Host " REASON : $_" -ForegroundColor Red
    ExitScript
}
