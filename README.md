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


More info
================

The only special setup, needed to make any Wordpress version to work with IBM Bluemix, is to configure the DB credentials in wp_config.php to use an environment variable VCAP_SERVICES to get the DB credential from the system.

Bluemix, as all CloudFoundry based systems, stores all information about the different services attached to the application in this environment variable, which make these variables available to all applications.

To extract the information in PHP, add the next code to your wp_config.php file (already in this repository):

	$vcap = getenv('VCAP_SERVICES');
	$vcap_json = json_decode($vcap,true);
	$vcap_arr = $vcap_json['cleardb'][0];

	/** The name of the database for WordPress */
	define('DB_NAME', $vcap_arr['credentials']['name']);

	/** MySQL database username */
	define('DB_USER', $vcap_arr['credentials']['username']);

	/** MySQL database password */
	define('DB_PASSWORD', $vcap_arr['credentials']['password']);

	/** MySQL hostname */
	define('DB_HOST', $vcap_arr['credentials']['hostname']);
