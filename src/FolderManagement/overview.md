
The **Folder Management** extension provides folder management features in your Visual Studio Online account, such as *easily creating new folders* in Git and TFVC repos.

**Quick steps to get started**

1. Connect to your team project.
1. Select **CODE**.
1. Select the context menu of the folder node, in the left tree view.
1. Select **Create a new folder**.
1. Specify a folder name and an optional checkin comment, and click on **Create**.
	- As empty folders are not allowed with Git, a file called `_placeholder.md` is added as part of the folder creation. 
	- TFVC currently has the same behaviour for consistency.
	- You can create nested folders by using `/`. For example, `MyNewFolder/MyNestedFolder`, creates the `_placeholder.md` file in the `MyNestedFolder` folder.
1. The folder and placeholder file are created.

**Learn more about this extension**

The source to this extension is available on GitHub: [VSO-Extension-FolderManagement](https://github.com/ALM-Rangers/VSO-Extension-FolderManagement). Feel free to take and modify.

To learn more about developing an extension for Visual Studio Online, see the [overview of extensions](https://www.visualstudio.com/en-us/integrate/extensions/overview).

