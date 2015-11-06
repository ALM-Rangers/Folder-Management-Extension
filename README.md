# VSO Extension - Folder Management

### What
Easily and quickly create new folders in Code Explorer through the Web Access for TFVC and Git.

### Why
Previously you could only create new files from web access. To add a folder, you would need to use your local Git or TFVC repository. This meant that people who aren’t comfortable using Git or Visual Studio, could not add a folder. This extension helps solve that problem.

### Steps
1. Clone this repo
2. Browse to the folder of the extension
3. Publish the contents of the extension to a local or cloud web server
4. The root of the extension should be at the root of the web server, for example: https://myserver/images/fabrikam-logo.png
5. Update the extension manifest file (extension.json). To do this, update the  namespace field to a globally unique value. For example: johnsmith.samples.foldermanagement. Also, update the  baseUri  field to be the fully qualified URL to the root of your web server, for example:  https://myserver 
8. Install the extension into your Visual Studio Online account (see https://www.visualstudio.com/en-us/integrate/extensions/publish/overview)

### Find out more
Check out [Wouter de Kort's](http://blogs.msdn.com/b/willy-peter_schaub/archive/2014/01/21/introducing-the-visual-studio-alm-rangers-wouter-de-kort.aspx) blog post [here](http://blogs.msdn.com/b/visualstudioalmrangers/archive/2015/07/01/folder-management-visual-studio-online-extension-by-wouter-de-kort.aspx), where he walks through the process and how it works.

![](https://github.com/ALM-Rangers/VSO-Extension-FolderManagement/blob/master/media/FolderManagementExtension.PNG)
![](https://github.com/ALM-Rangers/VSO-Extension-FolderManagement/blob/master/media/FolderManagementExtension_Dialog.PNG)

<table>
  <tr>
    <td>
      <img src="https://github.com/ALM-Rangers/VSO-Extension-FolderManagement/blob/master/media/VSALMLogo.png"></img>
    </td>
    <td>
      The Visual Studio ALM Rangers provide professional guidance, practical experience and gap-filling solutions to the ALM community. Visit <a href="http://aka.ms/vsarblog">aka.ms/vsarblog</a> to find out more.
    </td>
  </tr>
</table>
