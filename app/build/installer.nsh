RequestExecutionLevel Admin
!macro preInit
	SetRegView 64
	WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\The Bible\"
	WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\The Bible\"
	SetRegView 32
	WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files (x86)\The Bible\"
	WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files (x86)\The Bible\"
!macroend
RequestExecutionLevel Admin
!macro customUnInstall
    SetRegView 64
     DeleteRegKey /ifempty SHCTX "Software\Microsoft\Windows\CurrentVersion\Run\electron.app.my app"
    SetRegView 32
     DeleteRegKey /ifempty SHCTX "Software\Microsoft\Windows\CurrentVersion\Run\electron.app.my app"
 !macroend