#!/bin/bash
yum update
yum -y install nano docker docker-compose # shit to install :)

echo ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPF0Wf38KctiqQysh5GFQ39AJcJFVzEQ2HkYBhVnZwGV chrisng@stud.ntnu.no >> ~/.ssh/authorized_keys
echo ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDXLxb9SzQyJLpbovDJ2v7J5abRj2aYqe14VawKEulrYpcrLN/ZlBt+PNshyEDwAzC2VwwgRw2t3a1gADZY3vZeLdn2rTPY3DGcdGXdxaWYC2WzG9NnZ7lDBn6Bn+YeG1sCTErdj/Doq6JqaDpsn0lxQNMUhlTreSP1LxJnPqZccpRDDDeQWss1ANd/g0B/QS8m87IAErVOfKZa6tm74emw2Gc8m4FdlhJcDfIz5B+jQyBo68FB1nCXNV69+MYJtRXa234YdQ6GfXLGdwoa1FBOf2bdoTAhyjEI4gGLhGqdaB9VYpdQ7jOSB1Kry6pLR2srd4PyILMk1jOoGbyOSsMaVWAOSKIMf9Fz5youSJMvHwiGbUY6bU+5lbBhH+1llWYY5PnBXZF/bfS870QLccOHlRY5sxsael4s6CB9OxA0D1R6hunSX3CR8/U+V+Zz16kpfPAJGnroLjWgEP4fiFkRsUHEDzCE13eHfXznsxaGz5QBzRsubef8cCmBQLMgWpH0x+j/Duu5ZFj11X//1p2m1lmbHxi+PL1zgmFWmj6cCv66Mv2g8gYuy72AeME78YocMQjbNNxT78VJONBBNHtQpvtZMH4Zx0O7zH24WAXR3nzybPJiCCNx4xqljyq711xAjrL0Qe8XnW3hi4IGzQEBX1FAT1yeMeYAo8TFDOTIhw== olansk@stud.ntnu.no >> ~/.ssh/authorized_keys
echo ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCTukhZ68AKs1G/xDaEqDUR1UvsDPIqWwKSHlRL0Bk2DdS1ouYP7KuBlYkttGxj/Al9YzTEnUHYuc2+q1WCoOctGZxQIi/PMLzCDEbWEBsZATTL6jU0+iiIvrzlJaeTg5J8QzTV8af2bVlvVnzeO5EKnLdHj5Yo8pYGhIcJ7YEE9XB2W6QaApM5F8hjs+TK0lqrgCEAa35uV69adQmltVYEwwUAf+KC8I5QcXKeq3gMBriyU4CN/gFCubAJYdOzvHt9vX6YfMexXhTkYgYX3siQqwMBy7TK99RRtlgYFi17WOE9SXsJusXqWm6xOK2vswjF0SxSWpIKbBp95gln4w0E4Aqn9rAodQJsgy9ZVAqEbe2SJ/ym25b+tcbq3EQefh4nbrqTWzZ9w8tB186PEdAfbLeqxHoO4PMWJhs1gTdJ1/vf5pxJ0jyplvFRyKo/sUv4enkf06r5qQwnII+lr9Uh7Tt4jWzoGTejLYj3LBrCWFLbdgPJSe832AW3PffYhsd6saLyxtvrMrPQSGBPBUuz8/uGriYCbISBZaKADY15Kn1cYfytG0cAkfb7d5EFYJWXHhUH5cvQkWkwAH5S52YYnasR7pWFGQL23V8JsbUztItL+cK4WhnfVy5OOHD2pTNnrt26ZX9AZfw+02A/5bPKRdDUBWNvqOnfm6AvMpxuuQ== andreas >> ~/.ssh/authorized_keys
