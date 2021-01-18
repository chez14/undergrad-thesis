@echo off
echo OXAM Dir creation batch
echo Logfile will be collected to {{@data.logfile}}.
echo
echo
<f3:repeat group="{{@data.ujian.participants}}" value="{{@pos}}">
echo ===========================================================================
echo Working on {{@pos->computer->name}}
echo ===========================================================================
echo =========================================================================== >> {{@data.logfile}}
echo Working on {{@pos->computer->name}} >> {{@data.logfile}}
echo =========================================================================== >> {{@data.logfile}}
echo icacls-ing...
echo icacls-ing... >> {{@data.logfile}}
echo rd-ing...
echo rd-ing... >> {{@data.logfile}}
rd /S /Q "\\{{@pos->computer->ip}}\D$\ujian\{{@pos.username}} - {{@data.ujian.lecture->name}}" 2>> {{@data.logfile}}
echo mkdir-ing...
echo mkdir-ing... >> {{@data.logfile}}
mkdir "\\{{@pos->computer->ip}}\D$\ujian\{{@pos.username}} - {{@data.ujian.lecture->name}}" 2>> {{@data.logfile}}
echo takeown-ing...
echo takeown-ing... >> {{@data.logfile}}
takeown /A /F "\\{{@pos->computer->ip}}\D$\ujian\{{@pos.username}} - {{@data.ujian.lecture->name}}"
echo icacls-ing...
echo icacls-ing... >> {{@data.logfile}}
icacls "\\{{@pos->computer->ip}}\D$\ujian\{{@pos.username}} - {{@data.ujian.lecture->name}}" /inheritance:d /T>>  {{@data.logfile}}
icacls "\\{{@pos->computer->ip}}\D$\ujian\{{@pos.username}} - {{@data.ujian.lecture->name}}" /T /grant ftis\administrator:(OI)(CI)F ftis\administrator:(OI)(CI)(RX,W,DC) >> {{@data.logfile}}
icacls "\\{{@pos->computer->ip}}\D$\ujian\{{@pos.username}} - {{@data.ujian.lecture->name}}" /T /grant "ftis\{{@pos.username}}:(OI)(CI)(RX,W,DC)" /T >>  {{@data.logfile}}
icacls "\\{{@pos->computer->ip}}\D$\ujian\{{@pos.username}} - {{@data.ujian.lecture->name}}" /T /remove:g "Authenticated Users" >>  {{@data.logfile}}
icacls "\\{{@pos->computer->ip}}\D$\ujian\{{@pos.username}} - {{@data.ujian.lecture->name}}" /T /remove:g "Users" >>  {{@data.logfile}}
</f3:repeat>
echo
echo
echo Finished.