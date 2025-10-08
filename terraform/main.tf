# Configure the Azure Provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
  subscription_id = "7731977e-b09e-4f34-aba2-06a231ef44a2"
}

# Create a resource group
resource "azurerm_resource_group" "sonarqube_rg" {
  name     = "rg-sonarqube-${var.environment}"
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "SonarQube-Trivy"
    CreatedBy   = "Terraform"
  }
}

# Create a virtual network
resource "azurerm_virtual_network" "sonarqube_vnet" {
  name                = "vnet-sonarqube-${var.environment}"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.sonarqube_rg.location
  resource_group_name = azurerm_resource_group.sonarqube_rg.name

  tags = {
    Environment = var.environment
    Project     = "SonarQube-Trivy"
  }
}

# Create a subnet
resource "azurerm_subnet" "sonarqube_subnet" {
  name                 = "subnet-sonarqube-${var.environment}"
  resource_group_name  = azurerm_resource_group.sonarqube_rg.name
  virtual_network_name = azurerm_virtual_network.sonarqube_vnet.name
  address_prefixes     = ["10.0.2.0/24"]
}

# Create public IP
resource "azurerm_public_ip" "sonarqube_pip" {
  name                = "pip-sonarqube-${var.environment}"
  resource_group_name = azurerm_resource_group.sonarqube_rg.name
  location            = azurerm_resource_group.sonarqube_rg.location
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = {
    Environment = var.environment
    Project     = "SonarQube-Trivy"
  }
}

# Create Network Security Group and rule
resource "azurerm_network_security_group" "sonarqube_nsg" {
  name                = "nsg-sonarqube-${var.environment}"
  location            = azurerm_resource_group.sonarqube_rg.location
  resource_group_name = azurerm_resource_group.sonarqube_rg.name

  security_rule {
    name                       = "SSH"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = var.allowed_ssh_cidr
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "SonarQube"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "9000"
    source_address_prefix      = var.allowed_ssh_cidr
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "PostgreSQL"
    priority                   = 1003
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "5432"
    source_address_prefix      = "10.0.0.0/16"
    destination_address_prefix = "*"
  }

  tags = {
    Environment = var.environment
    Project     = "SonarQube-Trivy"
  }
}

# Create network interface
resource "azurerm_network_interface" "sonarqube_nic" {
  name                = "nic-sonarqube-${var.environment}"
  location            = azurerm_resource_group.sonarqube_rg.location
  resource_group_name = azurerm_resource_group.sonarqube_rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.sonarqube_subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.sonarqube_pip.id
  }

  tags = {
    Environment = var.environment
    Project     = "SonarQube-Trivy"
  }
}

# Associate Network Security Group to the network interface
resource "azurerm_network_interface_security_group_association" "sonarqube_nsg_association" {
  network_interface_id      = azurerm_network_interface.sonarqube_nic.id
  network_security_group_id = azurerm_network_security_group.sonarqube_nsg.id
}

# Generate random text for a unique storage account name
resource "random_id" "randomId" {
  keepers = {
    # Generate a new ID only when a new resource group is defined
    resource_group = azurerm_resource_group.sonarqube_rg.name
  }

  byte_length = 8
}

# Create storage account for boot diagnostics
resource "azurerm_storage_account" "sonarqube_storage" {
  name                     = "diag${random_id.randomId.hex}"
  location                 = azurerm_resource_group.sonarqube_rg.location
  resource_group_name      = azurerm_resource_group.sonarqube_rg.name
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    Environment = var.environment
    Project     = "SonarQube-Trivy"
  }
}

# Create virtual machine
resource "azurerm_linux_virtual_machine" "sonarqube_vm" {
  name                = "vm-sonarqube-${var.environment}"
  resource_group_name = azurerm_resource_group.sonarqube_rg.name
  location            = azurerm_resource_group.sonarqube_rg.location
  size                = var.vm_size
  admin_username      = var.admin_username
  admin_password      = var.admin_password

  disable_password_authentication = false

  network_interface_ids = [
    azurerm_network_interface.sonarqube_nic.id,
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
    disk_size_gb         = 64
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts-gen2"
    version   = "latest"
  }

  custom_data = base64encode(templatefile("${path.module}/cloud-init.yaml", {
    admin_username = var.admin_username
  }))

  boot_diagnostics {
    storage_account_uri = azurerm_storage_account.sonarqube_storage.primary_blob_endpoint
  }

  tags = {
    Environment = var.environment
    Project     = "SonarQube-Trivy"
  }
}