@echo off
echo OXAM special "ujian" folder takeowner
echo Logfile will be collected to {{@data.logfile}}.
echo
echo
<f3:repeat group="{{@data.ujian.participants}}" value="{{@pos}}">
echo ===========================================================================
echo Working on {{@pos.posisi}}
echo ===========================================================================
echo =========================================================================== >> {{@data.logfile}}
echo Working on {{@pos.posisi}} >> {{@data.logfile}}
echo =========================================================================== >> {{@data.logfile}}
takeown /A /F "\\{{@pos.computer->ip}}\D$\ujian" >> {{@data.logfile}}
icacls "\\{{@pos.computer->ip}}\D$\ujian" /inheritance:d /T >> {{@data.logfile}}
icacls "\\{{@pos.computer->ip}}\D$\ujian" /T /remove:g "Authenticated Users" >> {{@data.logfile}}
icacls "\\{{@pos.computer->ip}}\D$\ujian" /grant Everyone:RX ftis\administrator:F >> {{@data.logfile}}
</f3:repeat>