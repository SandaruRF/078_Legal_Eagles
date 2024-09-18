import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const Aboutcard = ({ image, name, linkedin }) => {
    return (
        <div>
            <Card
                style={{
                    width: "15rem",
                    border: "1px solid lightgray",
                    backgroundColor: "#41436A",
                }}
            >
                <Card.Img
                    variant="top"
                    src={image}
                    style={{
                        width: "93.4%",
                        height: "200px",
                        objectFit: "cover",
                        marginTop: "0.5rem",
                        marginRight: "0.47rem",
                        marginLeft: "0.47rem",
                        marginBottom: "0",
                    }}
                />
                <Card.Body>
                    <Card.Title style={{ color: "white", textAlign: "center" }}>
                        {name}
                    </Card.Title>
                    <Card.Text style={{ color: "white", fontSize: "14px" }}>
                        <div style={{ paddingBottom: "7px" }}>
                            AI Undergraduate
                        </div>
                        <div style={{ paddingBottom: "7px" }}>
                            Department of Computational Mathematics
                        </div>
                        <div style={{ paddingBottom: "7px" }}>
                            University of Moratuwa
                        </div>
                    </Card.Text>
                    <Button
                        variant="primary"
                        onClick={() => window.open(linkedin, "_blank")}
                        style={{ textAlign: "center" }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-linkedin"
                            viewBox="0 0 16 16"
                        >
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                        </svg>
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Aboutcard;
