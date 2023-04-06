import styled from "styled-components"

const Container = styled.div.attrs(() => ({
    className: 'container'
}))`
    
`;

const Row = styled.div.attrs(() => ({
    className: 'row'
}))`
    /* width: 100%; */
`;

const Col = styled.div.attrs(() => ({
    className: 'col-xl-2 col-lg-3 col-md-4'
}))`
    
`;

export { Container, Row, Col }