MxServo.init()
basic.forever(function () {
    serial.writeString("Battery=")
    serial.writeLine("" + (MxServo.readVbat()))
    MxServo.setAngle(ServoChannel.CH4, 0)
    MxServo.setAngle(ServoChannel.CH8, 180)
})
