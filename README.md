# wordpress-Bluemix

This is a demo Wordpress installation for the IBM Bluemix PaaS.

Preperations
================
Make sure you have an account on Bluemix (https://bluemix.net)a and login to your account
	
	cf login -a https://api.ng.bluemix.net

This app requires a MySQL DB. In this demo I use ClearDB
	cf create-service cleardb WPDB


Installation
================

Clone the repository from Github

	$ git clone https://github.com/ziniman/wordpress-bluemix.git
	
Go the app folder

	$ cd wordpress-bluemix
	
	
DONE! Go to your Bluemix app (<appname>.mybluemix.net) and enjoy Wordpress. 
