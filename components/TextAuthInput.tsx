import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from "@/context/theme";

interface AuthInputProps extends TextInputProps {
    
}

export const AuthInput: React.FC<AuthInputProps> = (props) => {
    const theme = useTheme().currentTheme;
    
    return (
        <TextInput
            style={[
                styles.input,
                {
                    backgroundColor: theme.foreground,
                    color: theme.text,
                    borderColor: theme.tint,
                },
            ]}
            placeholderTextColor={theme.text + '80'}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
    },
});