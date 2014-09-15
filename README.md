# Wordpress-Bluemix

This demo describes how to install a Wordpress application on the IBM Bluemix PaaS.

Preparations
================

1. Log into your Bluemix account (if you do not have one, create one at https://bluemix.net):

	$ cf login -a https://api.ng.bluemix.net

2. This app requires a MySQL database. For this demo, I use ClearDB:

	$ cf create-service cleardb spark WPDB

Installation
================

1. Clone the repository from Github:

	$ git clone https://github.com/ziniman/wordpress-bluemix.git

2. Go the app folder:

	$ cd wordpress-bluemix

3. Push the app to Bluemix using the custom Zend Server Buildpack (without starting the app 

yet): ***TEMP LOCATION***

	$ cf push <appname> --no-start -m 512M -b https://github.com/ziniman/Zend-Server-7-0-Bluemix.git

4. Bind the ClearDB service to your app:

	$ cf bind-service <appname> WPDB

5. Start the wordpress app:

	$ cf start <appname>

DONE! To start working with your Wordpress app on Bluemix, enter the following URL in a 

browser: &lt;appname&gt;.mybluemix.net


Additional Setup
================

**Database Setup**

To ensure your Wordpress app functions properly on Bluemix, you also need to configure the database credentials in the 'wp_config.php' file to use the VCAP_SERVICES environment variable to retrieve the database credentials from the system.

Bluemix, as with all CloudFoundry-based systems, stores all the information about the different services attached to the application in this environment variable, which make these variables available to all applications.

To extract the information in PHP, add the next code to your 'wp_config.php' file (already in this repository):

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
