# Folder Management
## What

This extension adds a menu option to folders in the code Web Access to create a new folder. The newly created folder contains a file placeholder.md that can be edited afterwards.

## Why

Web Access offered the ability to directly create new files. Creating a folder howevered required that you checked out all sources or cloned the repository.
With this extension you can now create folders and then add files to them all from Web Access.

A scenario where this is particular useful is for users who don't have Visual Studio. IT Pros for example can directly upload Powershell files trough web access. They can now also create new folders to group their scripts.

## Prerequisites

A TFVC or Git project. The Git project repository needs to be initialized with at least one file. After that, you can add new folders in both TFV and Git.

## Usage

Install the Extension in your account. Then open a TFVC or Git project, go the code tab and right click on an existing folder (or the root) in the source tree on the left.
Change the folder name and comment and click on create.

At the moment, this will cause the whole page to reload. Once more APIs become available this will be changed to a partial page refresh.