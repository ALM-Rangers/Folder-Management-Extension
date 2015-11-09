
The **Folder Management** extension provides folder management features in your Visual Studio Online account, such as *easily creating new folders*.

This extension includes:

- **New folders** - create new folders from the code explorer within the Team Web Access.
- **Git and TFVC** - as empty folders are not allowed with Git, a file called `_placeholder.md` is added as part of the folder creation. TFVC currently has the same behaviour for consistency.
- **Nested Folders** - create nested folders by using `/`. For example, `   MyNewFolder/MyNestedFolder/AnotherNestedFolder`, creates the `_placeholder.md` file in the `AnothernestedFolder` folder.
- **Checkin Comments** - specify a checkin comment when creating a folder.

----------

**Step by Step**

- Connect to your team project.
- Select **CODE**.
- Select the context menu of the folder node, in the left tree view.
- Select **Create a new folder**.
- Define a folder name and an optional checkin comment, and click on **Create**.
- The folder and placeholder file are created.

----------

**Planned Features**

- Make the creation of a placeholder file when creating a folder in TFVC optional.

**Known Issues**

- None

