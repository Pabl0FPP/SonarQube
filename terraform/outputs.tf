output "public_ip_address" {
  description = "The public IP address of the SonarQube VM"
  value       = azurerm_public_ip.sonarqube_pip.ip_address
}

output "ssh_connection_command" {
  description = "SSH command to connect to the VM"
  value       = "ssh ${var.admin_username}@${azurerm_public_ip.sonarqube_pip.ip_address}"
}

output "sonarqube_url" {
  description = "SonarQube web interface URL"
  value       = "http://${azurerm_public_ip.sonarqube_pip.ip_address}:9000"
}

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.sonarqube_rg.name
}

output "vm_name" {
  description = "Name of the virtual machine"
  value       = azurerm_linux_virtual_machine.sonarqube_vm.name
}