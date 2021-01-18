@echo off
echo OXAM Migration Tool
echo Logfile will be collected to {{@data.logfile}}.
echo
echo
<f3:repeat group="{{@data.migrations}}" value="{{@pos}}">
echo ===========================================================================
echo Migrating participant {{@pos.p->name}} on {{@pos.c_before->name}} to {{@pos.c_after->name}}
echo ===========================================================================
echo =========================================================================== >> {{@data.logfile}}
echo Migrating participant {{@pos.p->name}} on {{@pos.c_before->name}} to {{@pos.c_after->name}} >> {{@data.logfile}}
echo =========================================================================== >> {{@data.logfile}}
echo copying...
echo copying... >> {{@data.logfile}}
copy "\\{{@pos.c_before->ip}}\D$\ujian\{{@pos.p->username}} - {{@data.ujian.lecture->name}}" "\\{{@pos.c_after->ip}}\D$\ujian\{{@pos.p->username}} - {{@data.ujian.lecture->name}}" 2>> {{@data.logfile}}

echo Updating permissions...
echo Updating permissions... >> {{@data.logfile}}
icacls "\\{{@pos.c_after->ip}}\D$\ujian\{{@pos.p->username}} - {{@data.ujian.lecture->name}}" /inheritance:d /T>>  {{@data.logfile}}
icacls "\\{{@pos.c_after->ip}}\D$\ujian\{{@pos.p->username}} - {{@data.ujian.lecture->name}}" /T /grant ftis\administrator:(OI)(CI)F ftis\administrator:(OI)(CI)(RX,W,DC) >> {{@data.logfile}}
icacls "\\{{@pos.c_after->ip}}\D$\ujian\{{@pos.p->username}} - {{@data.ujian.lecture->name}}" /T /grant "ftis\{{@pos.p->username}}:(OI)(CI)(RX,W,DC)" /T >>  {{@data.logfile}}
icacls "\\{{@pos.c_after->ip}}\D$\ujian\{{@pos.p->username}} - {{@data.ujian.lecture->name}}" /T /remove:g "Authenticated Users" >>  {{@data.logfile}}
icacls "\\{{@pos.c_after->ip}}\D$\ujian\{{@pos.p->username}} - {{@data.ujian.lecture->name}}" /T /remove:g "Users" >>  {{@data.logfile}}
</f3:repeat>
echo
echo
echo Finished.