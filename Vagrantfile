# -*- mode: ruby -*-
# vi: set ft=ruby :
### 在4到10行配置你的虚拟机
box_name    = "newfuture/ubuntu"
node_folder = "./node/"#设置http://localhost/根目录,后端工作目录,与虚拟机同步共享（如D:/YunYinService/）
web_folder  = "./web/"#设置http://front.localhost/根目录,前端开发工作目录(同上)
web_port    = 80  #web端口，如果主机映射端口被占用换做其他
node_port   = 8888  #首次启动自动下载配置最新代码
vm_memory   = 512   #为虚拟机分配内存，可根据本机增大如1024
show_window = false #开机后是否显示窗口,如果要打开改为 true

#一下是具体配置，#号为注释内容
Vagrant.configure(2) do |config|
  config.vm.box = box_name

  ### 网络配置 ###
  config.vm.network "forwarded_port", guest: 80, host: web_port
  config.vm.network "forwarded_port", guest: node_port, host: node_port
  # 使用静态,下面的注释，注释上面的
  #config.vm.network "private_network", ip: "192.168.33.10"
  # 链接到主机相同的网络，自动IP
  # config.vm.network "public_network"

  ### 文件共享 ###
  if !web_folder.empty?
    config.vm.synced_folder web_folder, "/var/www/html/"  #web测试根目录
  end
  if !node_folder.empty?
    config.vm.synced_folder node_folder, "/vagrant/node/" #node服务
  end

  ### 虚拟机配置 ####
  # virtualbox
  config.vm.provider "virtualbox" do |vb|
    vb.gui = show_window
    vb.memory = vm_memory
  end
 end