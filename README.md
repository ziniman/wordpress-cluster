# Wordpress-Cluster

This demo describes how to install a Wordpress application on a cluster running on AWS, using Zend Server Marketplace AMI.

## Preparations

Please make sure you follow the next steps before deploying your code:
- Make sure you have an AWS account or create a new one.
- Create an AWS Private Key 
- Register to the Zend Server AMI your would like to use (based on your PHP version, Zend Server Edition and OS). The list of version is available [here](https://aws.amazon.com/marketplace/seller-profile/ref=dtl_pcp_sold_by?ie=UTF8&id=be5eed04-c761-4e81-b278-dca2d20b8482).
- Generate a [CloudFormation template](http://www.zend.com/en/products/server/cloudformation) on Zend.com based on the AMI you would like to run.  

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
```
/**Define AWS access keys for S3 Plugin*/
define( 'AWS_ACCESS_KEY_ID', 'MY_AWS_ACCESS_KEY_ID');
define( 'AWS_SECRET_ACCESS_KEY', 'MY_AWS_SECRET_ACCESS_KEY');
```
The plugin (WP Offload S3 Lite) is included in this repository.

#### EFS Support (Experimental) 

AWS are working on a new service called EFS – Elastic File System. This will allow you to get access to NFS as a service and share virtual storage across instances.

For Clustered WordPress deployments, this can replace all the file sync methods used today, including the one using S3 described above.

To use EFS you will need:
- Access to the EFS service (still in closed preview for now)
- Define a new EFS file system in the AWS Console
- Install NFS support on all your instances (please take into account that this won’t work in scale up scenario for new instances. This needs to be solved in the future)
For RedHat based Linux use
sudo yum install -y nfs-utils
For Ubuntu Linux use
sudo apt-get install nfs-common
(You might need to run a system update before being able to install NFS tools)
- Create a folder on each server for the mount point. In my example I use:
```
sudo mkdir \mnt\efs
```
- Mount the EFS to this folder
```
sudo mount -t nfs4 $(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone).fs-0ca44fa5.efs.us-west-2.amazonaws.com:/ /mnt/efs
```
- Create `/mnt/efs/wp/uploads` folder and assign write permission to this folder so the web server user can write into it.

When the mount point is set, all you need to do is check the ‘Turn on EFS support’ during the deployment process and the post_stage script will link your `wp-content/uploads` folder to `/mnt/efs/wp/uploads` and share all uploads across the entire cluster.
 
