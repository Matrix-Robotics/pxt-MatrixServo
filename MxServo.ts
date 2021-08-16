let __RLS = 0

enum ServoChannel
{
    CH1 = 1,
    CH2,
    CH3,
    CH4,
    CH5,
    CH6,
    CH7,
    CH8
}

//% weight=3 Servo=#8022be icon="\uf085" block="MxServo"
namespace MxServo{

    const MxServo_ADDR = 0x25

    enum ServoReg
    {
        Device_ID = 1,
        Device_Control_1,
        Device_Control_2,
        Battery_Voltage,
    }

    /**
     *start up the servo extension
    */
    //%block="start up the servo extension"
    //%weight=994 inlineInputMode="external" %blockID="MxServo_init"
    export function init(): void {

        if(i2cRead(ServoReg.Device_ID) == 0x46){
            i2cWrite(ServoReg.Device_Control_1, 0x08); // reset
            basic.pause(500);
            i2cWrite(ServoReg.Device_Control_1, 0x00); // enable
        }
    }

    /**
     *set servo angle
     *@param ch [1-8] select the channel of servo; eg: 1, 6
     *@param angle [0-180] set the angle of servo; eg: 0, 180
    */
    //%block="set %ch servo to %angle"
    //%weight=94 %blockID="MxServo_Angle"
    //% angle.min=0 angle.max=180
    export function setAngle(ch: ServoChannel, angle: number): void {
        let shift = 1 << (8-ch)
        __RLS |= shift
    
        i2cWrite(ServoReg.Device_Control_2, __RLS)

        i2cWrite(ch+4, angle)
    }

    /**
     *release the channel of servo
     *@param ch [1-8] select the channel of servo; eg: 1, 6
     *@param state logic of release; eg: true, false
    */
    //%block="servo %ch release"
    //%weight=93 %blockID="MxServo_Angle"
    export function ChannelRelease(ch: ServoChannel): void {
        let shift = 1 << (8-ch)
        let mask = 0x0F - shift
        __RLS &= mask

        i2cWrite(ServoReg.Device_Control_2, __RLS)
    }

    /**
     *read voltage of servo extension
    */
    //%block="read voltage of servo extension"
    //%weight=92 %blockID="MxServo_Vbat"
    export function readVbat(): number{
        return i2cRead(ServoReg.Battery_Voltage)*0.033
    }

    function i2cWrite(reg: number, value: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(MxServo_ADDR, buf)
    }  
    
    function i2cRead(reg: number): number {
        pins.i2cWriteNumber(MxServo_ADDR, reg, NumberFormat.UInt8LE)
        return pins.i2cReadNumber(MxServo_ADDR, NumberFormat.UInt8LE, false)
    } 
}
