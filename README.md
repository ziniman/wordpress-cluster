# Wordpress-Cluster

This demo describes how to install a Wordpress application on a cluster running on AWS, using Zend Server Marketplace AMI.

## Preparations

Please make sure you follow the next steps before deploying your code:
* Make sure you have an AWS account or create a new one.
* Create an AWS Private Key 
* Register to the Zend Server AMI your would like to use (based on your PHP version, Zend Server Edition and OS). The list of version is available [here](https://aws.amazon.com/marketplace/seller-profile/ref=dtl_pcp_sold_by?ie=UTF8&id=be5eed04-c761-4e81-b278-dca2d20b8482).
* Generate a [CloudFormation template](http://www.zend.com/en/products/server/cloudformation) on Zend.com based on the AMI you would like to run.  

## Generate a ZPK (Zend Server Package) Deployment file

I'm using Zend Studio to generate a ZPK file that is used to deploy my application on Zend Server. More information about ZPKs and Zend Server deployment is available on the official [Zend Server Documentation](http://files.zend.com/help/Zend-Server/zend-server.htm#understanding_the_package_structure.htm). 

## Additional Setup

#### Database Setup

To ensure your Wordpress app functions properly on AWS, you also need to configure the database credentials in the 'wp_config.php' file to use the correct credentials. This repository does not include a wp_config.php file. You can create your own or start without one and Wordpress install will create one for you when you access the server for the first time.

#### Permission Setup

You have to make sure that some folders in your Wordpress setup have the correct permission for the application to work. I use some Zend Server Deployment post stage script (see '/scripts/post_stage.php') to setup permissions on the uploads folder (still needed for the application to work although we store uploads on S3 - See below).
You can use this script for other settings as well.

#### AWS S3 plugin setup

Wordpress allows you to upload files, as part of posts editing and by default, will store the files on the local file system. This is not going to work in a cluster setup and really not a great way to ensure system scaling in the future. We should be able to store this content in a location available to all cluster members. 

To overcome this issue, I’ve added to this repository a Wordpress plugin that supports storing all uploaded media on [AWS’s S3](https://aws.amazon.com/s3) service.  

If you would like to use the service, you will have to create an access key on AWS and use it in the plugin. The plugin supports storing the key both in the DB (not recommended) and in the wp-config.php file in your code base. 
For this to work, I had to add the next lines to wp-config.php:

	/**Define AWS access keys for S3 Plugin*/
	define( 'AWS_ACCESS_KEY_ID', 'MY_AWS_ACCESS_KEY_ID');
	define( 'AWS_SECRET_ACCESS_KEY', 'MY_AWS_SECRET_ACCESS_KEY');
The plugin (amazon-s3-and-cloudfront) is included in this repository.
