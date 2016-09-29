# -*- mode: ruby -*-
# vi: set ft=ruby :
#######################################
####    在6到14行配置你的虚拟机    ####
#######################################
box_name    = "newfuture/ubuntu"
node_folder = "./"#设置http://localhost/根目录,后端工作目录,与虚拟机同步共享（如D:/YunYinService/）
web_folder  = ""#设置http://front.localhost/根目录,前端开发工作目录(同上)
node_port   = 8888  #首次启动自动下载配置最新代码
web_port    = 80
static_ip   = "192.168.33.33"  #静态IP
public_net  = false #是否使用公网IP
vm_memory   = 512   #为虚拟机分配内存，可根据本机增大如1024
check_update= false #是否检查更新
#######################################
###以下是具体配置，一般不需要修改
########################################
Vagrant.configure(2) do |config|
  config.vm.box = box_name
  config.vm.box_check_update=check_update
  config.vm.synced_folder ".", "/vagrant", :mount_options =>["dmode=777,fmode=766"]
  ### 网络配置 ###
  config.vm.network "forwarded_port", guest: node_port, host: node_port, auto_correct: true
  if !static_ip.empty?
    config.vm.network "private_network", ip: static_ip#私有静态IP配置
  end
  if public_net
    config.vm.network "public_network"#启用公网桥接
  end
  ### 文件共享 ###
  if !web_folder.empty?
    config.vm.network "forwarded_port", guest: 80, host: web_port, auto_correct: true
    config.vm.synced_folder web_folder, "/var/www/html/"  #web测试根目录
  end
  if !node_folder.empty?
    #config.vm.synced_folder node_folder, "/home/vagrant/node/" #node服务
    config.vm.provision "packages",type: "shell", inline: "cd /vagrant/;npm install"#首次导入自动安装依赖包
    config.vm.provision "watch",type: "shell",inline: "cd /vagrant/;npm run backgroud",run: "always",privileged:false #自动检测变化
  end
  ### 虚拟机配置 ###
  config.vm.provider "virtualbox" do |vb|  # virtualbox
    vb.memory = vm_memory
  end

  config.vm.post_up_message=<<-msg
  服务器已启动
  node根目录在~/node/与本地#{node_folder}同步,node可用端口#{node_port}
  ssh地址127.0.0.1端口2222 用户名vagrant密码vagrant
  msg
 end
