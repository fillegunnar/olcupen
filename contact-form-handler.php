<?php
  $captain = $_POST['lagkapten'];
  $team = $_POST['lagnamn'];
  $email = $_POST['email'];
  $members =$_POST['medlemar'];

  $send_from = 'styrelsen@olcupen.com';

  $email_subject = $team;

  $email_body = "Lagkapten: $captain. \n". "Lagnamn: $team. \n". "E-post: $email. \n". "Medlemmar: $members.";

  $to = "styrelsen@olcupen.com";

  $headers = "From: $email_from \r\n";
  $headers .= "Reply-To: $email \r\n";
  mail($to,$email_subject,$email_body,$headers);

  header("Location: index.html");




?>
