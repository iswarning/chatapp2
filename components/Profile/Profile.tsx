import EditIcon from '@mui/icons-material/Edit';
import { BtnContainer, Container, InformationContainer, Label, TextGroup, TextGroupCol, TextGroupRow, TextName, UpdateButton, Upper, UpperImage, UserAvatar, UserContainer, UserProfile, Value, ValueContainer } from "./ProfileStyled";

export default function Profile({userInfo}: any) {

    return (
        <Container>
            <Upper>
                <UpperImage src={userInfo?.upperImage ?? '/images/upper-image-default.png'} />
            </Upper>
            <UserContainer>
                <UserProfile>
                    <UserAvatar src={userInfo?.photoURL ?? '/images/avatar-default.jpg'} />
                </UserProfile>
            </UserContainer>
            
            <InformationContainer>
                <TextName>{ userInfo?.fullName ? userInfo?.fullName : 'Albert Einstein'}</TextName>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Email:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.email ? userInfo?.email : 'mail@gmail.com'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Ngày sinh:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.birthday ? userInfo?.birthday : '21-12-2012'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Địa chỉ:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.address ? userInfo?.address : 'Los Angeles California San Fransisco'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Giới tính:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.gender ? userInfo?.gender : 'Male'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>             
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Số điện thoại:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.phoneNumber ? userInfo?.phoneNumber : '0903123456'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Cập nhật lần cuối:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.updated_at ? userInfo?.updated_at : '12/04/2023'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <BtnContainer>
                    <UpdateButton>
                        <EditIcon fontSize="medium" />&nbsp;Edit Information
                    </UpdateButton>
                </BtnContainer>
            </InformationContainer>
        </Container>
    )
}



