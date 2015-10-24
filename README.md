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
8. Install the extension into your Visual Studio Online account
9. Navigate to  https://youraccount.visualstudio.com/DefaultCollection/_admin/_ext  (replace your account with your real account name)
10. Click Install and browse to your manifest file, for example extension.json
11. Click OK

### Find out more
Check out [Wouter de Kort's](http://blogs.msdn.com/b/willy-peter_schaub/archive/2014/01/21/introducing-the-visual-studio-alm-rangers-wouter-de-kort.aspx) blog post [here](http://blogs.msdn.com/b/visualstudioalmrangers/archive/2015/07/01/folder-management-visual-studio-online-extension-by-wouter-de-kort.aspx), where he walks through the process and how it works.

![](https://github.com/ALM-Rangers/VSO-Extension-FolderManagement/blob/master/media/FolderManagementExtension.PNG)
![](https://github.com/ALM-Rangers/VSO-Extension-FolderManagement/blob/master/media/FolderManagementExtension_Dialog.PNG)

### M85 Changes
1. The services "vss.history" and "vss.dialogs" have been renamed to "ms.vss-web.navigation-service" and "ms.vss-web.dialog-service", respectively.
2. The VSS.init() call now takes two separate properties to load in scripts and styles. Replace setupModuleLoader: true with usePlatformScripts: true or usePlatformStyles: true (or both, if necessary).
3. The client object model changed which meant changing code to match the new object model
4. Based on feedback from Will Smythe, all raw REST api calls were refactored to use the REST client api
5. New manifest file is m85_extension.json

<!---REMEMBER TO ADD THIS TO YOUR README-->
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
