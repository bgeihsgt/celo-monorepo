variable region {
    type            = string
    description     = "AWS Region to provision this cluster"
    default         = "us-west-1"
}

variable cidr_blocks {
    type            = object({
      vpc                 = string
      subnet_az1_public   = string
      subnet_az1_private  = string
      subnet_az2_public   = string
      subnet_az2_private  = string
      allowed_ssh_clients = string
    })
    description     = "The cidr_blocks for the different subnets in a redundant Celo network"
    default         = {
      vpc                 = "10.10.0.0/16"
      subnet_az1_public   = "10.10.0.0/24"
      subnet_az1_private  = "10.10.1.0/24"
      subnet_az2_public   = "10.10.10.0/24"
      subnet_az2_private  = "10.10.11.0/24"
      allowed_ssh_clients = "0.0.0.0/0"
    }
}

variable key_pair_name {
    type            = string
    description     = "SSH key pair name"
}

variable celo_image {
  type              = string
  description       = "Docker image for Celo nodes"
  default           = "us.gcr.io/celo-testnet/celo-node:1.8"
}

variable celo_network_id {
  type              = string
  description       = "ID of the Celo network to join"
  default           = "200110"
}

variable proxies {
  description = "Configuration for zero or more proxies in each availability zone."
  type        = object({
    az1   = map(object({
      validator_name              = string
      validator_signer_address    = string
    }))
    az2   = map(object({
      validator_name              = string
      validator_signer_address    = string
    }))
  })
  default = {
    az1     = {}
    az2     = {}
  }
  # Here is an example configuration. We recommend putting this into a secret.auto.tfvars file.
  # default = {
  #   az1 = {
  #     myvalidator_az1_01 = {
  #       validator_name            = "myvalidator_az1_01"
  #       validator_signer_address  = "0000000011111111222222223333333344444444"
  #     }
  #     myvalidator_az1_02 = {
  #       validator_name            = "myvalidator_az1_02"
  #       validator_signer_address  = "5555555566666666777777778888888899999999"
  #     }
  #   }
  #   az2 = {
  #     myvalidator_az2_01 = {
  #       validator_name            = "myvalidator_az2_01"
  #       validator_signer_address  = "4444444433333333222222221111111100000000"
  #     }
  #     myvalidator_az2_02 = {
  #       validator_name            = "myvalidator_az2_02"
  #       validator_signer_address  = "9999999988888888777777776666666655555555"
  #     }
  #   }
  #
  # }
}

variable validators {
    description     = "Configuration for zero or more validators in each availability zone"
    type            = object({ 
      az1 = map(object({
        name                          = string
        signer_address                = string
        signer_private_key            = string
        signer_private_key_password   = string
        signer_private_key_filename   = string
        proxy_enode                   = string
        proxy_private_ip              = string
        proxy_public_ip               = string
      }))
      az2 = map(object({
        name                          = string
        signer_address                = string
        signer_private_key            = string
        signer_private_key_password   = string
        signer_private_key_filename   = string
        proxy_enode                   = string
        proxy_private_ip              = string
        proxy_public_ip               = string
      }))
    })
    default = {
      az1 = {}
      az2 = {}
    }
  # Here is an example configuration. We recommend putting this into a secret.auto.tfvars file.
  # default = {
  #   az1 = {
  #     myvalidator_az1_01 = {
  #       name                          = "myvalidator_az1_01"
  #       signer_address                = "0000000011111111222222223333333344444444"
  #       signer_private_key            = "...Place the keystore file contents here Make sure to escape the double quotes. ..."
  #       signer_private_key_password   = "mypassword"
  #       signer_private_key_filename   = "UTC--2020-02-06T06-49-54.736290200Z--0000000011111111222222223333333344444444"
  #       proxy_enode                   = "00000000000000001111111111111111222222222222222233333333333333334444444444444444555555555555555566666666666666667777777777777777"
  #       proxy_private_ip              = "10.10.0.120"
  #       proxy_public_ip               = "1.1.1.1"
  #     }
  #     myvalidator_az1_02 = {
  #       ...
  #     }
  #   }
  #   az2 = {
  #     myvalidator_az2_01 = {
  #       ...
  #     }
  #     myvalidator_az2_02 = {
  #       ...
  #     }
  #   }
  #
  # }
}


variable celo_image_attestation {
  type        = string
  description = "Docker image for Celo attestation service"
  default     = "us.gcr.io/celo-testnet/celo-monorepo:attestation-service-baklava"
}

variable twilio_messaging_service_sid {
  type            = string
}

variable twilio_account_sid {
  type            = string
}

variable twilio_blacklist {
  type            = string
}

variable twilio_auth_token {
  type            = string
}

variable attestation_services {
  description     = "Configuration for zero or more attestation nodes in each availability zone"
  type            = object({
    az1 = map(object({
      validator_name                            = string
      validator_address                         = string
      attestation_signer_address                = string
      attestation_signer_private_key            = string
      attestation_signer_private_key_password   = string
      attestation_signer_private_key_filename   = string
    }))
    az2 = map(object({
      validator_name                            = string
      validator_address                         = string
      attestation_signer_address                = string
      attestation_signer_private_key            = string
      attestation_signer_private_key_password   = string
      attestation_signer_private_key_filename   = string
    }))
  })
  default = {
    az1 = {}
    az2 = {}
  }
  # Here is an example configuration. We recommend putting this into a secret.auto.tfvars file.
  # default = {
  #   az1 = {
  #     myvalidator_az1_01 = {
  #       validator_name                            = "myvalidator_az1_01"
  #       validator_address                         = "1234567812345678123456781234567812345678"
  #       attestation_signer_address                = "2323232345454545676767678989898910101010"
  #       attestation_signer_private_key            = "...Place the keystore file contents here Make sure to escape the double quotes. ..."
  #       attestation_signer_private_key_password   = "mypassword"
  #       attestation_signer_private_key_filename   = "UTC--2020-02-06T06-49-54.736290200Z--2323232345454545676767678989898910101010"
  #     }
  #     myvalidator_az1_02 = {
  #       ...
  #     }
  #   }
  #   az2 = {
  #     myvalidator_az2_01 = {
  #       ...
  #     }
  #     myvalidator_az2_02 = {
  #       ...
  #     }
  #   }
  #
  # }
}