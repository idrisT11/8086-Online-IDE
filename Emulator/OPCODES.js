const   MOV_RM_RM = 0x88,
        MOV_IMMEDIATE_TO_RM = 0xC6,
        MOV_IMMEDIATE_TO_R  = 0xb0,
        MOV_ACCUMULATOR_MEMORY = 0xA0,
        MOV_RM_SEGEMENT=6953095,
        AND_RM_RM=0b001000,
        AND_IMMEDIATE_TO_R=0b1000000,
        AND_IMMEDIATE_TO_ACC=0b0010010,
        OR_RM_RM=0b0000100
        OR_IMMEDIATE_TO_R=0b1000000,
        OR_IMMEDIATE_TO_ACC=0b0010010,
        XOR_RM_RM=0b001100,
        XOR_IMMEDIATE_TO_R=0b1000000,
        XOR_IMMEDIATE_TO_ACC=0b0011010;
        TEST_RM_RM=0b1000010,
        TEST_IMMEDIATE_TO_R=0b1111011,
        TEST_IMMEDIATE_TO_ACC=0b1010100,
        NOT=0b1111011,
        SHR=0b110100,
        SAR=0b110100,
        ROL=0b110100,
        ROR=0b110100,
        RCL=0b110100,
        RCR=0b110100

      
const   HIGH_REGISTER = 1,
        LOW_REGISTER = 2
const NO_DISP   = 0x00,
      IWEN_DISP = 0x01,
      SIN_DISP  = 0x02,
      REG_MODE  = 0x03;


        

