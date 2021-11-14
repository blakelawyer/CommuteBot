variable "container_image" { 
    type = string
    description = "The full URI to the container to deploy"
}

variable "desired_count" { 
    type = number
    default = 1
}