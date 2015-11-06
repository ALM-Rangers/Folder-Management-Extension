# Easily create new folders #

Folder Management is an extension for Visual Studio Online that lets you create new folders directly from web access. This is especially helpfull for users who don't have Visual Studio or another IDE installed.

Folder Management can create new folders both for TFVC and for Git. Git doesn't allow empty folders so a file called `_placeholder.md` is added. TFVC has the same behavior for consistency.

You can create nested folders by using `/`. For example:
 
 `   MyNewFolder/MyNestedFolder/AnotherNestedFolder`
    
This will create the `_placeholder.md` file in the `AnothernestedFolder ` folder.

When creating a folder, you can specify a comment for your checkin or push.