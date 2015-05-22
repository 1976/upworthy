<?php
	require "../../includes/class_phpmailer.php";
	$returnData = array();
	
	if($_POST["dob"] == ""){
		$mail = new PHPMailer(true);
		$mail->IsHTML(true);
		$mail->CharSet = "UTF-8";
		
		$body = '<p>Hi Upworthy. I think this link is worth looking at <a href="'.$_POST["link"].'">'.$_POST["link"].'</a>.<br/>';
		
		if($_POST["location-input"] == "I made it myself"){
			$body = $body.$_POST["location-input"].".";
		}else if($_POST["location-input"] == "Other"){
			$body = $body."I saw it someplace.";
		}else{
			$body = $body."I saw it on ".$_POST["location-input"].".";
		}
		
		$error;
		
		try{
			$mail->SetFrom(strtolower($_POST["email"]));
			$mail->AddAddress("jason@1976inc.com");
			$mail->Subject = "I think you should see this!";
	
			$mail->Body = $body;
			$mail->send();

		} catch (phpmailerException $e) {
			$error =  $e->errorMessage(); //Pretty error messages from PHPMailer
		} catch (Exception $e) {
			$error = $e->getMessage(); //Boring error messages from anything else!
		}
		
		if(isset($error)){
			$returnData["success"] = false;
			$returnData["error"] = $error;
		}else{
			$returnData["success"] = true;
			$returnData["message"] = "Thanks for Contacting us. If we feel your content is Upworthy we will be in touch.";
		}
	}else{
		$returnData["success"] = false;
		$returnData["message"] = "An unknown error occurred.";
	}
	
	echo json_encode($returnData);

?>