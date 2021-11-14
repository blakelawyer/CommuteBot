variable "container_image" { 
    type = string
    description = "The full URI to the container to deploy"
}

variable "desired_count" { 
    type = number
    default = 1
}

variable "bot_token" { 
    type = string
    description = "Discord bot token"
}


variable "db_host" { 
    type = string
}


variable "db_user" { 
    type = string
}


variable "db_password" { 
    type = string
}


variable "db_name" { 
    type = string
}

