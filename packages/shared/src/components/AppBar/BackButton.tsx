import Icon from "../../assets/Icon";
import useAppRouter from "../../hooks/useRouter";

const BackButton = () => {
  const { navigate } = useAppRouter();
  const onClick = () => {
    navigate('back');
  }

  return (
    <button onClick={onClick}>
      <Icon path="/AppBar/arrow-left.svg" width={17} height={9} color="" />
    </button>
  )
}

export default BackButton;