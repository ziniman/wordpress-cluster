# Wordpress-Bluemix

This demo describes how to install a Wordpress application on the IBM Bluemix PaaS.

## Preparations

Log into your Bluemix account (if you do not have one, create one at https://bluemix.net):

	$ cf login -a https://api.ng.bluemix.net

This app requires a MySQL database. For this demo, I use ClearDB:

	$ cf create-service cleardb spark WPDB

## Installation

Clone the repository from Github:

	$ git clone https://github.com/ziniman/wordpress-bluemix.git

Go the app folder:

	$ cd wordpress-bluemix

Push the app to Bluemix using the custom Zend Server Buildpack (without starting the app yet): ***TEMP LOCATION***

	$ cf push <appname> --no-start -m 512M -b https://github.com/ziniman/Zend-Server-7-0-Bluemix.git

Bind the ClearDB service to your app:

	$ cf bind-service <appname> WPDB

Start the wordpress app:

	$ cf start <appname>

DONE! To start working with your Wordpress app on Bluemix, enter the following URL in a browser: &lt;appname&gt;.mybluemix.net


## Additional Setup

#### Database Setup

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

#### AWS S3 plugin setup

Since Bluemix, as all PaaS based on CloudFoundry, has an Ephemeral file system, files that are stores on the instnace by the user, will be deleted on every update of the code (with ‘cf push’) or restart of the application.

Wordpress allows you to upload files, as part of posts editing and by default, will store the files on the local file system. This is not going to work in a PaaS setup and really not a great way to ensure system scaling in the future.

To overcome this issue, I’ve added to this repository a Wordpress plugin that supports storing all uploaded media on [AWS’s S3](https://aws.amazon.com/s3) service.  

If you would like to use the service, you will have to create an access key on AWS and use it in the plugin. The plugin supports storing the key both in the DB (not recommended) and in the wp-config.php file in your code base. 
Since I’m trying to avoid from storing specific content in wp-config.php and use Environment Variables as much as I can, I’ve added the next lines to wp-config.php:

	/**Define AWS access keys for S3 Plugin*/
	define( 'AWS_ACCESS_KEY_ID', getenv('AWS_ACCESS_KEY_ID') );
	define( 'AWS_SECRET_ACCESS_KEY', getenv('AWS_SECRET_ACCESS_KEY') );

To set your AWS credentials as an Environment Variables, run the next commands:

	$ cf set-env bluemixwp AWS_ACCESS_KEY_ID <YOUR ACCESS KEY ID>
	$ cf set-env bluemixwp AWS_SECRET_ACCESS_KEY <YOUR SECRET ACCESS KEY>
