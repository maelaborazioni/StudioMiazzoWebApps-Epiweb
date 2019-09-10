/**
 * Callback method for when solution is opened.
 *
 * @properties={typeid:24,uuid:"243DBAD5-2B09-48A6-8100-3FDAEE87DF57"}
 * @AllowToRunInFind
 */
function ma_ew_onSolutionOpen(_startArgs)
{
	// Set the callback for the update status of operations
	globals.vOperationDoneFunction = forms.mao_history.operationDone;
	
	// Set the callback for checking operations' status
	globals.vUpdateOperationStatusFunction = forms.mao_history.checkStatusCallback;

	// Visualizzazione icona nuove notifiche
	if(globals.ma_utl_hasModule(globals.Module.COMUNICAZIONI))
	   scopes.message.verifyUserMessages(globals.svy_sec_lgn_user_id);
	
	// Visualizzazione dati news relative al program name PresenzaSemplice
	// (solo per gli utenti in possesso della chiave per la rilevazione delle presenze)
	if (globals.ma_utl_hasKey(globals.Key.RILEVAZIONE_PRESENZE))
	{
		if(!scopes.news.verificaDatiNews(globals.svy_sec_lgn_owner_id,globals.svy_sec_lgn_user_id,'StudioMiazzoWebApps',true))
		{
			// Verifica per le ditte del gruppo se sono presenti sull'ftp dati inviati dalla sede
			// e in caso affermativo lancia la ricezione automatica (nell'ordine tabelle generali/ditta/certificati telematici)
	//		if (globals.ma_utl_hasKey(globals.Key.RILEVAZIONE_PRESENZE)) 
			plugins.busy.prepare();
			
			plugins.busy.unblock();
			
			if(!globals.ma_utl_hasKey(globals.Key.FTP_NO_CONTROLLO))
			{
				var params = {
			        processFunction: process_ew_verifica_ftp,
			        message: 'Controllo presenza dati inviati dallo studio da acquisire...', 
			        opacity: 0.5,
			        paneColor: '#434343',
			        textColor: '#EC1C24',
			        showCancelButton: false,
			        cancelButtonText: '',
			        dialogName : '',
			        fontType: 'Arial,4,25',
			        processArgs: []
			    };
				plugins.busy.block(params);
			}
		}
	}	
}

/**
 * @properties={typeid:24,uuid:"0B0FCD79-D9CD-4C3E-84F6-7F8F50F0F4BE"}
 */
function process_ew_verifica_ftp()
{
	try{
		globals.verificaDatiFtp();
	}
	catch(ex)
	{
		var msg = 'Metodo process_ew_verifica_ftp : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}