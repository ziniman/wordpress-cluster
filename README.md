# wordpress-Bluemix

This is a demo Wordpress installation for the IBM Bluemix PaaS.

Preparations
================
Make sure you have an account on Bluemix (https://bluemix.net) and login to your account
	
	$cf login -a https://api.ng.bluemix.net

This app requires a MySQL DB. In this demo I use ClearDB

	$cf create-service cleardb WPDB


Installation
================

Clone the repository from Github

	$ git clone https://github.com/ziniman/wordpress-bluemix.git
	
Go the app folder

	$ cd wordpress-bluemix
	
Push the app to Bluemix using the custom Zend Server Buildpack (without starting the app yet)	

	$ cf push <appname> --no-start 512M -b https://github.com/zendtech/zend-server-php-buildpack-bluemix

Bind the ClearDB service to your app

	$ cf bind-service <appname> WPDB

Start the wordpress app 

	$ cf start <appname>

DONE! Go to your Bluemix app (&lt;appname&gt;.mybluemix.net) and enjoy Wordpress. 
