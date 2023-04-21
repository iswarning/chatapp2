import styled from "styled-components"

const Container = styled.div.attrs(() => ({
    className: 'container'
}))`
    /* background-color: whitesmoke; */
`;

const Row = styled.div.attrs(() => ({
    className: 'row'
}))`
    /* width: 100%; */
`;

const Col = styled.div.attrs(() => ({
    className: 'col-xl-3 col-lg-3 col-sm-4'
}))`
    
`;

export { Container, Row, Col }