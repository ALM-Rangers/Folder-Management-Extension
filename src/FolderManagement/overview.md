
The **Folder Management** extension provides folder management features in your Visual Studio Online account, such as *easily creating new folders*.

This extension includes:

- **New folders** - areate new folders from the code explorer within the Team Web Access.
- **Git and TFVC** - as empty folders are not allowed with Git, a file called `_placeholder.md` is added as part of the folder creation. TFVC currently has the same behaviour for consistency.
- **Nested Folders** - You can create nested folders by using `/`. For example, `   MyNewFolder/MyNestedFolder/AnotherNestedFolder`, creates the `_placeholder.md` file in the `AnothernestedFolder` folder.
- **Checkin Comments** - Specify a checkin comment when creating a folder.

----------

**Planned Features**

- Make the creation of a placeholder file when creating a folder in TFVC optional.

**Known Issues**

- None

