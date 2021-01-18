@echo off
echo OXAM Takeowner creation batch
echo Logfile will be collected to {{@data.logfile}}.
echo
echo
<f3:repeat group="{{@data.ujian.participants}}" value="{{@pos}}">
echo ===========================================================================
echo Working on {{@pos.computer.name}}
echo ===========================================================================
echo =========================================================================== >> {{@data.logfile}}
echo Working on {{@pos.computer.name}} >> {{@data.logfile}}
echo =========================================================================== >> {{@data.logfile}}
echo takeowning...
echo takeowning... >> {{@data.logfile}}

icacls "\\{{@pos->computer->ip}}\D$\ujian\{{@pos->username}} - {{@data.ujian->lecture->name}}" /T /deny ftis\Students:(OI)(CI)(RX,W,DC) /remove:g "ftis\{{@pos.username}}" /T 2>> {{@data.logfile}}

</f3:repeat>
echo
echo
echo Finished.