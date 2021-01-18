@echo off
echo OXAM Copy Soal creation batch
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
echo copying...
echo copying... >> {{@data.logfile}}
copy "C:\Users\Administrator\Desktop\FILE UJIAN OXAM (WEB)" "\\{{@pos->computer->ip}}\D$\ujian\{{@pos.username}} - {{@data.ujian.lecture->name}}" 2>> {{@data.logfile}}

</f3:repeat>
echo
echo
echo Finished.