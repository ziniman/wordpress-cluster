# Wordpress-Cluster

This demo describes how to install a Wordpress application on a cluster running on AWS, using Zend Server Marketplace AMI.

## Preparations

Please make sure you follow the next steps before deploying your code:
* Make sure you have an AWS account or create a new one.
* Create an AWS Private Key 
* Register to the Zend Server AMI your would like to use (based on your PHP version, Zend Server Edition and OS. The list of version is available [here[(https://aws.amazon.com/marketplace/seller-profile/ref=dtl_pcp_sold_by?ie=UTF8&id=be5eed04-c761-4e81-b278-dca2d20b8482).
* Generate a [CloudFormation template](http://www.zend.com/en/products/server/cloudformation) on Zend.com based on the AMI you would like to run.  

## Additional Setup

#### Database Setup

To ensure your Wordpress app functions properly on AWS, you also need to configure the database credentials in the 'wp_config.php' file to use the VCAP_SERVICES environment variable to retrieve the database credentials from the system.

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

Wordpress allows you to upload files, as part of posts editing and by default, will store the files on the local file system. This is not going to work in a cluster setup and really not a great way to ensure system scaling in the future. We need to store this the of content in a location available to all cluster members. 

To overcome this issue, I’ve added to this repository a Wordpress plugin that supports storing all uploaded media on [AWS’s S3](https://aws.amazon.com/s3) service.  

If you would like to use the service, you will have to create an access key on AWS and use it in the plugin. The plugin supports storing the key both in the DB (not recommended) and in the wp-config.php file in your code base. 
Since I’m trying to avoid from storing specific content in wp-config.php and use Environment Variables as much as I can, I’ve added the next lines to wp-config.php:

	/**Define AWS access keys for S3 Plugin*/
	define( 'AWS_ACCESS_KEY_ID', getenv('AWS_ACCESS_KEY_ID') );
	define( 'AWS_SECRET_ACCESS_KEY', getenv('AWS_SECRET_ACCESS_KEY') );

To set your AWS credentials as an Environment Variables, run the next commands:

#TBD#
