# Practical Angular JS: Intermediate Topics

In this folder we'll work through expanding the app we built in the fundamentals section by adding a real backend in the Laravel PHP MVC framework, topics covered will include Authentication, CSRF tokens, and how to hook into some of angulars "middleware" inside of things like `$httpProvider.interceptors`

## Dependencies

If you want to follow along verbatim you'll need a more involved setup; I recommend following the [instructions on setting up Laravel Homestead](http://laravel.com/docs/4.2/homestead) which makes the environment stuff easy and supports Mac, Linux and Windows.

Once you've completed the Homestead setup you'll need to do the following:

- Setup Homestead.yaml to look like this (**note:** I have my code in ~/code/, you'll need to modify the path if you're on Windows)

```yaml
---
ip: "192.168.10.10"
memory: 2048
cpus: 1

authorize: ~/.ssh/id_rsa.pub

keys:
    - ~/.ssh/id_rsa

folders:
    - map: ~/code/Homestead
      to: /home/vagrant/code

sites:
    - map: laravel.app
      to: /home/vagrant/code/e2e-with-angular/public

variables:
    - key: APP_ENV
      value: local
```

- Copy the start or finish folders into `~/code/Homestead/e2e-with-angular` or a folder of your choosing
- `vagrant up`
- `vagrant ssh`
- inside vagrant, navigate to the `e2e-with-angular` directory then `php artisan migrate && php artisan db:seed`

Finally, edit your `/etc/hosts` file to include entries that will map the Homestead sites to a domain name of your choice, here's what mine looks like (**note** how the IP matches the one in Homestead.yaml):

```shell
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1 localhost
255.255.255.255 broadcasthost
::1             localhost
192.168.10.10   laravel.app
```

## Running the App

If you have Homestead setup, Vagrant configured properly then you should have an app running and can open your browser to `http://laravel.app`

If for some reason this doesn't work, you can always manually run the app inside of vagrant using `php artisan serve`
